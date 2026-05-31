import { Injectable,
         NotFoundException,
         BadRequestException,
         ForbiddenException, // Adicione este

 } from '@nestjs/common';

 import{
        TaskPriority,
        TaskStatus,

 } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {

        constructor(
            private prisma: PrismaService,
            private auditService: AuditService,
        ){}

        async create( // função para criar uma nova task dentro de um projeto 
            projectId: string,
            createdById: string,
            data:{
                title: string,
                description?: string,
                priority?: TaskPriority,
                assignedToId?: string,
                dueDate? : string,


            },

        ){
            const project =
      await this.prisma.project.findUnique({ // procura se existe o projeto para poder criar a task
        where: {
          id: projectId,
        },
      });

    if (!project) {
      throw new NotFoundException( // se não achar o projeto lança esse erro : 
        'Project not found',
      );
    }

    const task =
      await this.prisma.task.create({ // cria a task passando as informações 
        data: {
          title: data.title,

          description: data.description,

          priority: data.priority,

          dueDate: data.dueDate
            ? new Date(data.dueDate)
            : undefined,

          assignedToId: data.assignedToId,

          projectId,

          createdById,
        },
      });

    await this.auditService.log({ // salva no log a criação da task 
      action: 'CREATE_TASK',

      description: `Task ${task.title} criada`,

      actorId: createdById,

      organizationId:
        project.organizationId,
    });

    return task;
        }

        
        async deleteTask( // método para deletar uma task
          projectId: string,
          taskId: string,
          actorId: string,
        ) {
          // Primeiro verifica se a task existe e pertence ao projeto
          const task = await this.prisma.task.findFirst({
            where: {
              id: taskId,
              projectId: projectId,
            },
            include: {
              project: true,
            },
          });

          if (!task) {
            throw new NotFoundException('Task not found');
          }

          
          // (Apenas ADMIN ou o criador da task podem deletar)
          const membership = await this.prisma.membership.findFirst({
            where: {
              userId: actorId,
              organizationId: task.project.organizationId,
            },
          });

          if (!membership || (membership.role !== 'ADMIN' && task.createdById !== actorId)) {
            throw new ForbiddenException('You do not have permission to delete this task');
          }

          // Deleta a task
          const deletedTask = await this.prisma.task.delete({
            where: {
              id: taskId,
            },
          });

          // Registra no log
          await this.auditService.log({
            action: 'DELETE_TASK',
            description: `Task ${task.title} deletada`,
            actorId: actorId,
            organizationId: task.project.organizationId,
          });

          return deletedTask;
        }

        async updateStatus( // método para atualizar o status de uma task 
  projectId: string,

  taskId: string,

  status: TaskStatus,

  actorId: string,
) {
  const task =
    await this.prisma.task.findFirst({ // procura a task primeiro 
      where: {
        id: taskId,

        projectId,
      },
    });

  if (!task) {
    throw new NotFoundException( // se não achar lança esse erro 
      'Task not found',
    );
  }

  const updatedTask =
    await this.prisma.task.update({ // atualiza ela apenas o status 
      where: {
        id: taskId,
      },

      data: {
        status,
      },
    });

  const project =
    await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

  await this.auditService.log({ // registra no log a atualização do status da task 
    action: 'UPDATE_TASK_STATUS',

    description: `Task ${task.title} alterada para ${status}`,

    actorId,

    organizationId:
      project!.organizationId,
  });

  return updatedTask;
}

async findAllByProject( // método para listar as tasks de um projeto por filtro ou listar todas 
  projectId: string,

  page = 1,

  limit = 10,

  status?: TaskStatus,

  priority?: TaskPriority,

  assignedToId?: string,
) {
  const skip =
    (page - 1) * limit;

  return this.prisma.task.findMany({ // busca n tasks
    where: {
      projectId, // só as tasks daquele projeto 

      ...(status && { status }),

      ...(priority && { priority }),

      ...(assignedToId && {
        assignedToId,
      }),
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      assignedTo: {
        select: {
          id: true,

          name: true,

          email: true,
        },
      },

      createdBy: {
        select: {
          id: true,

          name: true,

          email: true,
        },
      },
    },
  });
}

async assignTask( // função que atribui uma task para um usuário 
  projectId: string,

  taskId: string,

  assignedToId: string,

  actorId: string,
) {
  const task =
    await this.prisma.task.findFirst({ // procura a task 
      where: {
        id: taskId,

        projectId,
      },

      include: {
        project: true,
      },
    });

  if (!task) {
    throw new NotFoundException( // se não encontrar, lança o erro 
      'Task not found',
    );
  }

  const user =
    await this.prisma.user.findUnique({ // procura o user 
      where: {
        id: assignedToId,
      },
    });

  if (!user) {
    throw new NotFoundException( // valida se ele existe
      'User not found',
    );
  }

  const membership =
    await this.prisma.membership.findFirst({ // valida se ele pertence a empresa 
      where: {
        userId: assignedToId,

        organizationId:
          task.project.organizationId,
      },
    });

  if (!membership) {
    throw new BadRequestException( // se ele não pertencer a organização, lança o erro 
      'User does not belong to organization',
    );
  }

  const updatedTask =
    await this.prisma.task.update({ // faz a atribuição passando o id do usuário 
      where: {
        id: taskId,
      },

      data: {
        assignedToId,
      },

      include: {
        assignedTo: {
          select: {
            id: true,

            name: true,

            email: true,
          },
        },
      },
    });

  await this.auditService.log({ // atualiza o log 
    action: 'ASSIGN_TASK',

    description:
      `Task ${task.title} atribuída para ${user.email}`,

    actorId,

    organizationId:
      task.project.organizationId,
  });

  return updatedTask;
}

async updateDueDate( // método para atualizar a data de uma task de um projeto
  projectId: string,

  taskId: string,

  dueDate: string,

  actorId: string,
) {
  const task =
    await this.prisma.task.findFirst({ // procura a task 
      where: {
        id: taskId,

        projectId,
      },

      include: {
        project: true,
      },
    });

  if (!task) {
    throw new NotFoundException( // se não achar, lança esse erro 
      'Task not found',
    );
  }

  const updatedTask =
    await this.prisma.task.update({ // atualiza apenas a data da task 
      where: {
        id: taskId,
      },

      data: {
        dueDate: new Date(dueDate),
      },
    });

  await this.auditService.log({ // atualiza o log com a data da task atualizada 
    action: 'UPDATE_TASK_DUE_DATE',

    description:
      `Prazo da task ${task.title} atualizado`,

    actorId,

    organizationId:
      task.project.organizationId,
  });

  return updatedTask;
}

async findOverdueTasks( // método para achar tasks atrasadas 
  projectId: string,
) {
  return this.prisma.task.findMany({ // procura a task 
    where: {
      projectId,

      dueDate: {
        lt: new Date(),
      },

      status: {
        not: TaskStatus.DONE, // compara se a data de finalização é antes da data atual 
      },
    },

    orderBy: {
      dueDate: 'asc',
    },

    include: {
      assignedTo: {
        select: {
          id: true,

          name: true,

          email: true,
        },
      },
    },
  });
}
async updateTask(
  projectId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
  },
  actorId: string,
) {
  const task = await this.prisma.task.findFirst({
    where: { id: taskId, projectId },
    include: { project: true },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const updatedTask = await this.prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
    },
  });

  await this.auditService.log({
    action: 'UPDATE_TASK',
    description: `Task ${task.title} atualizada`,
    actorId,
    organizationId: task.project.organizationId,
  });

  return updatedTask;
}

}